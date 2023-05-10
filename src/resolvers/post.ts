import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        const posts = await Post.find();
        return posts;
    }

    @Query(() => Post, { nullable: true })
    async post(@Arg("id") id: string): Promise<Post | null> {
        const post = await Post.findOneBy({ id: parseInt(id) });
        return post;
    }

    @Mutation(() => Post)
    async createPost(@Arg("title") title: string): Promise<Post | null> {
        const post = new Post();
        post.title = title;
        return await post.save();
    }
}
