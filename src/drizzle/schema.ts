import { relations, sql } from "drizzle-orm";
import {
	binary,
	date,
	int,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";

export const user = mysqlTable("user", {
	id: varchar("id", { length: 21 })
		.$defaultFn(() => nanoid())
		.primaryKey(),
	username: varchar("username", { length: 256 }).unique().notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	departmentId:varchar("departmentId",{length:21}).notNull().references(() => department.id,{onDelete:"cascade"}),
	job: text("job").notNull(),
	extension: text("extension").notNull(),
	role: mysqlEnum("roles", ["Admin", "Teacher"]).notNull(),
});

export const classroom = mysqlTable("classroom", {
	id: varchar("id", { length: 21 })
		.$defaultFn(() => nanoid())
		.primaryKey(),
	name: varchar("name", { length: 256 }).unique().notNull(),
	place: text("place").notNull(),
	description: text("description").notNull(),
	addedTime: timestamp("addedTime", { mode: "date" }).notNull(),
	updatedTime: timestamp("updatedTime", { mode: "date" }).notNull(),
});

export const borrowing = mysqlTable("borrowing", {
	id: varchar("id", { length: 21 })
		.$defaultFn(() => nanoid())
		.primaryKey(),
	userId: varchar("userId", { length: 21 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	startTime: date("startTime").notNull(),
	endTime: date("endTime"),
	from: int("from").notNull(),
	to: int("to").notNull(),
	classroomId: varchar("classroomId", { length: 21 })
		.notNull()
		.references(() => classroom.id, { onDelete: "cascade" }),
});

export const department=mysqlTable("department",{
	id: varchar("id", { length: 21 })
		.$defaultFn(() => nanoid())
		.primaryKey(),
	name:text("name").notNull(),
	description:text("description").notNull()
})

export const departmentRelations=relations(department,({many}) => ({
	members:many(user)
}))

export const userRelations = relations(user, ({ many,one }) => ({
	borrows: many(borrowing),
	department:one(department,{
		fields:[user.id],
		references:[department.id]
	})
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

