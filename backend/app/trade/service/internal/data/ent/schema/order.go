package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"

	"github.com/tx7do/go-crud/entgo/mixin"
)

// Order 订单实体
// 记录从 book-service 获取到的订单快照信息。
type Order struct {
	ent.Schema
}

func (Order) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "trade_orders"},
		schema.Comment("订单表"),
	}
}

func (Order) Fields() []ent.Field {
	return []ent.Field{
		field.Uint32("book_id"),
		field.String("book_title").NotEmpty(),
		field.Int32("quantity"),
		field.Float("unit_price").Default(0),
		field.Float("total_price").Default(0),
		field.Uint32("user_id"),
		field.Int32("status").Default(1),
	}
}

func (Order) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AutoIncrementId{},
		mixin.TimeAt{},
	}
}
