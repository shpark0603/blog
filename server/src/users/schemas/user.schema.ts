import { Field, ID } from '@nestjs/graphql';
import { hash, compare } from 'bcrypt';
import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop()
  username: string;

  @Prop()
  password: string;

  comparePassword: (password: string) => Promise<boolean>;
}

export type UserDocument = User & Document;
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

export { UserSchema };

export const UserModelFactory: AsyncModelFactory = {
  name: User.name,
  useFactory: () => {
    UserSchema.pre<UserDocument>('save', async function (next) {
      if (!this.isModified('password')) {
        return next();
      }

      this.password = await hash(this.password, 10);
      next();
    });

    return UserSchema;
  },
};
