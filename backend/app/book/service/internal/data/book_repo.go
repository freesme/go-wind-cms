package data

import (
	"context"
	"sync"
	"sync/atomic"

	"github.com/go-kratos/kratos/v2/log"
	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/tx7do/go-utils/trans"
	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
)

// BookRepo 书籍仓库（内存实现，用于 Demo）
type BookRepo struct {
	mu      sync.RWMutex
	books   map[uint32]*bookv1.Book
	counter atomic.Uint32
	log     *log.Helper
}

func NewBookRepo(logger log.Logger) *BookRepo {
	repo := &BookRepo{
		books: make(map[uint32]*bookv1.Book),
		log:   log.NewHelper(logger),
	}
	repo.seed()
	return repo
}

// seed 初始化示例数据
func (r *BookRepo) seed() {
	for _, b := range []struct {
		title, author string
		price         float32
		stock         int32
	}{
		{"Go 语言编程", "许式伟", 59.9, 100},
		{"微服务架构设计模式", "Chris Richardson", 89.0, 50},
		{"深入理解计算机系统", "Bryant", 139.0, 30},
	} {
		id := r.counter.Add(1)
		r.books[id] = &bookv1.Book{
			Id:     trans.Ptr(id),
			Title:  trans.Ptr(b.title),
			Author: trans.Ptr(b.author),
			Price:  trans.Ptr(b.price),
			Stock:  trans.Ptr(b.stock),
		}
	}
}

func (r *BookRepo) List(_ context.Context, req *paginationv1.PagingRequest) (*bookv1.ListBooksResponse, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var books []*bookv1.Book
	for _, b := range r.books {
		books = append(books, b)
	}
	total := uint64(len(books))

	if req != nil {
		pageNum, pageSize := int(req.GetPage()), int(req.GetPageSize())
		if pageSize <= 0 {
			pageSize = 10
		}
		if pageNum <= 0 {
			pageNum = 1
		}
		start := (pageNum - 1) * pageSize
		if start >= len(books) {
			books = nil
		} else {
			end := start + pageSize
			if end > len(books) {
				end = len(books)
			}
			books = books[start:end]
		}
	}

	return &bookv1.ListBooksResponse{Items: books, Total: total}, nil
}

func (r *BookRepo) Get(_ context.Context, req *bookv1.GetBookRequest) (*bookv1.Book, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	b, ok := r.books[req.GetId()]
	if !ok {
		return nil, status.Errorf(codes.NotFound, "book %d not found", req.GetId())
	}
	return b, nil
}

func (r *BookRepo) Create(_ context.Context, req *bookv1.CreateBookRequest) error {
	if req.GetData() == nil {
		return status.Error(codes.InvalidArgument, "data is required")
	}
	r.mu.Lock()
	defer r.mu.Unlock()

	id := r.counter.Add(1)
	b := *req.GetData()
	b.Id = trans.Ptr(id)
	r.books[id] = &b
	r.log.Infof("book created: id=%d title=%s", id, b.GetTitle())
	return nil
}

func (r *BookRepo) Update(_ context.Context, req *bookv1.UpdateBookRequest) error {
	if req.GetData() == nil {
		return status.Error(codes.InvalidArgument, "data is required")
	}
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.books[req.GetId()]; !ok {
		return status.Errorf(codes.NotFound, "book %d not found", req.GetId())
	}
	b := *req.GetData()
	b.Id = trans.Ptr(req.GetId())
	r.books[req.GetId()] = &b
	return nil
}

func (r *BookRepo) Delete(_ context.Context, req *bookv1.DeleteBookRequest) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.books[req.GetId()]; !ok {
		return status.Errorf(codes.NotFound, "book %d not found", req.GetId())
	}
	delete(r.books, req.GetId())
	return nil
}
