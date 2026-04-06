package data

import (
	"context"
	"github.com/go-kratos/kratos/v2/log"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"strings"

	entCrud "github.com/tx7do/go-crud/entgo"

	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	entModel "go-wind-cms/app/book/service/internal/data/ent"
	"go-wind-cms/app/book/service/internal/data/ent/book"

	"github.com/tx7do/go-utils/trans"
	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
)

type BookRepo struct {
	log       *log.Helper
	entClient *entCrud.EntClient[*entModel.Client]
}

func NewBookRepo(ctx log.Logger, client *entCrud.EntClient[*entModel.Client]) *BookRepo {
	repo := &BookRepo{
		log:       log.NewHelper(ctx),
		entClient: client,
	}

	if repo.entClient == nil {
		repo.log.Warn("book ent client is nil, repo init skipped")
	}
	return repo
}

func toBookPB(item *entModel.Book) *bookv1.Book {
	if item == nil {
		return nil
	}
	return &bookv1.Book{
		Id:     trans.Ptr(item.ID),
		Title:  trans.Ptr(item.Title),
		Author: trans.Ptr(item.Author),
		Price:  trans.Ptr(float32(item.Price)),
		Stock:  trans.Ptr(item.Stock),
	}
}

// List 列出书籍（分页并返回总数）。
func (r *BookRepo) List(ctx context.Context, req *paginationv1.PagingRequest) (*bookv1.ListBooksResponse, error) {
	if r.entClient == nil {
		return nil, status.Error(codes.Internal, "book ent client not ready")
	}

	if req == nil {
		req = &paginationv1.PagingRequest{}
	}

	pageNum := int(req.GetPage())
	pageSize := int(req.GetPageSize())
	if pageNum <= 0 {
		pageNum = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	offset := (pageNum - 1) * pageSize

	// 1) 查询分页列表，按自增 ID 排序，返回稳定结果。
	entities, err := r.entClient.Client().Book.
		Query().
		Order(entModel.Asc(book.FieldID)).
		Limit(pageSize).
		Offset(offset).
		All(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	books := make([]*bookv1.Book, 0, len(entities))
	for _, item := range entities {
		books = append(books, toBookPB(item))
	}

	// 2) 统计总量，用于前端分页展示。
	total, err := r.entClient.Client().Book.Query().Count(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &bookv1.ListBooksResponse{Items: books, Total: uint64(total)}, nil
}

// Get 获取单本书详情。
func (r *BookRepo) Get(ctx context.Context, req *bookv1.GetBookRequest) (*bookv1.Book, error) {
	if r.entClient == nil {
		return nil, status.Error(codes.Internal, "book ent client not ready")
	}
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "request is required")
	}

	// 1) 按主键读取实体。
	item, err := r.entClient.Client().Book.Get(ctx, req.GetId())
	if entModel.IsNotFound(err) {
		return nil, status.Errorf(codes.NotFound, "book %d not found", req.GetId())
	}
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return toBookPB(item), nil
}

// Create 新建书籍。
func (r *BookRepo) Create(ctx context.Context, req *bookv1.CreateBookRequest) error {
	if r.entClient == nil {
		return status.Error(codes.Internal, "book ent client not ready")
	}
	if req == nil || req.GetData() == nil {
		return status.Error(codes.InvalidArgument, "data is required")
	}

	data := req.GetData()
	if data.GetTitle() == "" || data.GetAuthor() == "" {
		return status.Error(codes.InvalidArgument, "title and author are required")
	}

	// 1) 做字段清洗，去除前后空白，确保数据库落库数据标准化。
	_, err := r.entClient.Client().Book.Create().
		SetTitle(strings.TrimSpace(data.GetTitle())).
		SetAuthor(strings.TrimSpace(data.GetAuthor())).
		SetPrice(float64(data.GetPrice())).
		SetStock(data.GetStock()).
		Save(ctx)
	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}

	return nil
}

// Update 更新书籍。
func (r *BookRepo) Update(ctx context.Context, req *bookv1.UpdateBookRequest) error {
	if r.entClient == nil {
		return status.Error(codes.Internal, "book ent client not ready")
	}
	if req == nil || req.GetData() == nil {
		return status.Error(codes.InvalidArgument, "data is required")
	}

	data := req.GetData()
	// 1) 按 ID 更新可变字段，并在更新结束后返回最新写入状态。
	_, err := r.entClient.Client().Book.UpdateOneID(req.GetId()).
		SetTitle(data.GetTitle()).
		SetAuthor(data.GetAuthor()).
		SetPrice(float64(data.GetPrice())).
		SetStock(data.GetStock()).
		Save(ctx)
	if entModel.IsNotFound(err) {
		return status.Errorf(codes.NotFound, "book %d not found", req.GetId())
	}
	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}

	return nil
}

// Delete 删除书籍。
func (r *BookRepo) Delete(ctx context.Context, req *bookv1.DeleteBookRequest) error {
	if r.entClient == nil {
		return status.Error(codes.Internal, "book ent client not ready")
	}
	if req == nil {
		return status.Error(codes.InvalidArgument, "request is required")
	}

	// 1) 按 ID 删除，不存在时返回 NotFound。
	err := r.entClient.Client().Book.DeleteOneID(req.GetId()).Exec(ctx)
	if entModel.IsNotFound(err) {
		return status.Errorf(codes.NotFound, "book %d not found", req.GetId())
	}
	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}

	return nil
}
