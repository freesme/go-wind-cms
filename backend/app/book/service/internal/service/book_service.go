package service

import (
	"context"

	"github.com/go-kratos/kratos/v2/log"
	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"google.golang.org/protobuf/types/known/emptypb"

	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
	"go-wind-cms/app/book/service/internal/data"
)

// BookService 书籍服务实现
type BookService struct {
	bookv1.UnimplementedBookServiceServer

	log      *log.Helper
	bookRepo *data.BookRepo
}

func NewBookService(logger log.Logger, bookRepo *data.BookRepo) *BookService {
	return &BookService{
		log:      log.NewHelper(logger),
		bookRepo: bookRepo,
	}
}

func (s *BookService) List(ctx context.Context, req *paginationv1.PagingRequest) (*bookv1.ListBooksResponse, error) {
	return s.bookRepo.List(ctx, req)
}

func (s *BookService) Get(ctx context.Context, req *bookv1.GetBookRequest) (*bookv1.Book, error) {
	return s.bookRepo.Get(ctx, req)
}

func (s *BookService) Create(ctx context.Context, req *bookv1.CreateBookRequest) (*emptypb.Empty, error) {
	if err := s.bookRepo.Create(ctx, req); err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}

func (s *BookService) Update(ctx context.Context, req *bookv1.UpdateBookRequest) (*emptypb.Empty, error) {
	if err := s.bookRepo.Update(ctx, req); err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}

func (s *BookService) Delete(ctx context.Context, req *bookv1.DeleteBookRequest) (*emptypb.Empty, error) {
	if err := s.bookRepo.Delete(ctx, req); err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
