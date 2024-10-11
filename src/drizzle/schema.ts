import { relations, sql } from "drizzle-orm";
import {
	date,
	int,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
	id: varchar("id", { length: 48 })
		.$defaultFn(() => crypto.randomUUID())
		.primaryKey(),
	username: varchar("username", { length: 256 }).unique().notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	department: text("department").notNull(),
	extension: text("extension").notNull(),
	role: mysqlEnum("roles", ["Admin", "Teacher"]).notNull(),
});

export const classroom = mysqlTable("classroom", {
	id: varchar("id", { length: 48 })
		.default(sql`('UUID()')`)
		.primaryKey(),
	name: varchar("name", { length: 256 }).unique().notNull(),
	place: text("place").notNull(),
	description: text("description").notNull(),
	addedTime: timestamp("addedTime", { mode: "date" }).notNull(),
	updatedTime: timestamp("updatedTime", { mode: "date" }).notNull(),
});

export const borrowing = mysqlTable("borrowing", {
	id: varchar("id", { length: 48 })
		.default(sql`('UUID()')`)
		.primaryKey(),
	userId: varchar("userId", { length: 48 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	startTime: date("startTime").notNull(),
	endTime: date("endTime"),
	from: int("from").notNull(),
	to: int("to").notNull(),
	classroomId: varchar("classroomId", { length: 48 })
		.notNull()
		.references(() => classroom.id, { onDelete: "cascade" }),
});

export const userRelations = relations(user, ({ many }) => ({
	borrows: many(borrowing),
}));

export const classroomRelations = relations(classroom, ({ many }) => ({
	borrowingDatas: many(borrowing),
}));

export const borrowingRelations = relations(borrowing, ({ one }) => ({
	user: one(user, {
		fields: [borrowing.userId],
		references: [user.id],
	}),
	classroom: one(classroom, {
		fields: [borrowing.classroomId],
		references: [classroom.id],
	}),
}));

