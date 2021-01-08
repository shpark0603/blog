import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostInput: CreatePostInput): Promise<PostDocument> {
    const post = await new this.postModel(createPostInput).save();
    return post;
  }

  async findAll(page: number): Promise<PostDocument[]> {
    if (page < 0 || !page) {
      page = 1;
    }

    return this.postModel
      .find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
  }

  async getLastPage(): Promise<number> {
    const postCount = await this.postModel.countDocuments().exec();

    return Math.ceil(postCount / 10);
  }

  async findOne(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: string,
    updatePostInput: UpdatePostInput,
  ): Promise<PostDocument> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostInput, { new: true })
      .exec();

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  async remove(id: string): Promise<string> {
    const removedPost = await this.postModel.findByIdAndRemove(id).exec();

    if (!removedPost) {
      throw new NotFoundException('Post not found');
    }

    return 'Success';
  }
}
