package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"

	"github.com/tx7do/go-crud/entgo/mixin"
)

// Book 书籍实体
// 持久化图书的标题、作者、价格和库存。
type Book struct {
	ent.Schema
}

func (Book) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "books"},
		schema.Comment("书籍表"),
	}
}

func (Book) Fields() []ent.Field {
	return []ent.Field{
		field.String("title").NotEmpty(),
		field.String("author").NotEmpty(),
		field.Float("price").Default(0),
		field.Int32("stock").Default(0),
	}
}

func (Book) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AutoIncrementId{},
		mixin.TimeAt{},
	}
}
