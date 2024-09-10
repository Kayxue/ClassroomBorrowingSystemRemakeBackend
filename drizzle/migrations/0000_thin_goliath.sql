DO $$ BEGIN
 CREATE TYPE "public"."roles" AS ENUM('Admin', 'Teacher');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "borrowing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"startTime" date NOT NULL,
	"endTime" date,
	"from" integer,
	"to" integer,
	"classroomId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classroom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"place" text,
	"description" text,
	"addedTime" timestamp,
	"updatedTime" timestamp,
	CONSTRAINT "classroom_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"department" text NOT NULL,
	"extension" text NOT NULL,
	"role" "roles" NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_classroomId_classroom_id_fk" FOREIGN KEY ("classroomId") REFERENCES "public"."classroom"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
