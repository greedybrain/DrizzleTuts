import "dotenv/config";

import { User } from "./db/schema";
import db from "./db/drizzle";
import { sql } from "drizzle-orm";

const main = async () => {
    // const user = await db
    //     .insert(User)
    //     .values({
    //         name: "Ozzie",
    //         age: 33,
    //         email: "oztheman@gmail.com",
    //     })
    //     .returning({ name: User.name, email: User.email, age: User.age });

    // console.log("User: ", user[0]);

    const users = await db.query.User.findMany({
        with: {
            posts: true,
            preference: true,
        },
        // offset: 2,
        // limit: 1,
        // extras: {
        //     lowerCaseName: sql<string>`lower(${User.name})`.as("lowerCaseName"),
        // },
        // columns: {
        //     age: true,
        // },
    });

    console.log("Users: ", users);
};

main();
