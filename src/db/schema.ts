import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    real,
    timestamp,
    unique,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const UserRole = pgEnum("userRoles", ["ADMIN", "BASIC"]);

export const User = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: varchar("name", { length: 255 }).notNull(),
        age: integer("age").notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        role: UserRole("userRole").default("BASIC").notNull(),
    },
    // do the below for faster querying (indexing, or uniqueIndexing)
    (table) => ({
        emailIndex: uniqueIndex("emailIndex").on(table.email),
        uniqueNameAndAge: unique("uniqueNameAndAge").on(table.name, table.age),
    }),
);

export const UserPreference = pgTable("userPreferences", {
    id: uuid("id").primaryKey().defaultRandom(),
    emailUpdates: boolean("emailUpdates").notNull().default(false),
    userId: uuid("userId")
        .references(() => User.id, { onDelete: "cascade" })
        .notNull(),
});

export const Post = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    averageRating: real("averageRating").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    authorId: uuid("authorId")
        .references(() => User.id)
        .notNull(),
});

export const Category = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
});

export const PostCategory = pgTable(
    "postCategory",
    {
        postId: uuid("postId")
            .references(() => Post.id)
            .notNull(),
        categoryId: uuid("categoryId")
            .references(() => Category.id)
            .notNull(),
    },
    (table) => ({
        primaryKey: primaryKey({ columns: [table.postId, table.categoryId] }),
    }),
);

// DRIZZLE RELATIONS
export const UserRelations = relations(User, ({ one, many }) => ({
    preference: one(UserPreference),
    posts: many(Post),
}));

export const UserPreferenceRelations = relations(UserPreference, ({ one }) => ({
    user: one(User, {
        fields: [UserPreference.userId],
        references: [User.id],
    }),
}));

export const PostRelations = relations(Post, ({ one, many }) => ({
    user: one(User, {
        fields: [Post.authorId],
        references: [User.id],
    }),
    postCategories: many(PostCategory),
}));

export const CategoryRelations = relations(Category, ({ many }) => ({
    postCategories: many(PostCategory),
}));
