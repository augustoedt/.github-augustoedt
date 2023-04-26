import { faker } from '@faker-js/faker';

export const userFactory = () => {
  const name = faker.name.fullName();
  const email = faker.internet.email();
  return { email, name };
};

export const commentFactory = () => {
  const content = faker.lorem.sentence();
  return { content };
};
