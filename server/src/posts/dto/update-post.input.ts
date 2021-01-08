import { CreatePostInput } from './create-post.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => ID)
  @IsMongoId({ message: 'Invalid ID' })
  id: string;
}
