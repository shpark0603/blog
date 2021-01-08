import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './schemas/post.schema';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { ParseObjectIdPipe } from 'src/shared/mongoid.pipe';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll(
    @Args({ name: 'page', type: () => Int, nullable: true })
    page: number | null,
  ) {
    return this.postsService.findAll(page);
  }

  @Query(() => Int, { name: 'lastPageOfPosts' })
  getLastPage() {
    return this.postsService.getLastPage();
  }

  @Query(() => Post, { name: 'post' })
  findOne(
    @Args({ name: 'id', type: () => ID }, new ParseObjectIdPipe()) id: string,
  ) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => String)
  removePost(
    @Args({ name: 'id', type: () => ID }, new ParseObjectIdPipe()) id: string,
  ) {
    return this.postsService.remove(id);
  }

  // @Mutation(() => String)
  // _clearPost() {
  //   this.postsService._clear();
  //   return 'Cleared post collection';
  // }
}
