import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['Admin', 'Teacher']);

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  department: text('department').notNull(),
  extension: text('extension').notNull(),
  role: rolesEnum('role').notNull(),
});

export const classroom = pgTable('classroom', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').unique().notNull(),
  place: text('place').notNull(),
  description: text('description').notNull(),
  addedTime: timestamp('addedTime', { mode: 'date' }).notNull(),
  updatedTime: timestamp('updatedTime', { mode: 'date' }).notNull(),
});

export const borrowing = pgTable('borrowing', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  startTime: date('startTime').notNull(),
  endTime: date('endTime'),
  from: integer('from').notNull(),
  to: integer('to').notNull(),
  classroomId: uuid('classroomId')
    .notNull()
    .references(() => classroom.id, { onDelete: 'cascade' }),
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
