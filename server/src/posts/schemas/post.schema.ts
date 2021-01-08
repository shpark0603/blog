import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  body: string;

  @Field(() => [String])
  @Prop([String])
  tags: string[];

  @Field()
  @Prop({ default: Date.now })
  publishedDate: Date;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
