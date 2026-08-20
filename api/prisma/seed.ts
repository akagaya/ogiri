import { PrismaClient } from '@prisma/client';
import { generateId } from '../src/lib/ulid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // システムユーザーの作成
  const systemUserId = generateId();
  const systemUser = await prisma.user.upsert({
    where: { username: 'system' },
    update: {},
    create: {
      id: systemUserId,
      username: 'system',
      display_name: 'システム',
      password_hash: 'SYSTEM_USER_NO_LOGIN'
    }
  });

  // 初回のお題を作成
  const initialTopicIds = [generateId(), generateId(), generateId()];
  const topics = [
    {
      id: initialTopicIds[0],
      user_id: systemUser.id,
      body: '写真で一言'
    },
    {
      id: initialTopicIds[1],
      user_id: systemUser.id,
      body: 'こんなAIアシスタントは嫌だ。どんなの？'
    },
    {
      id: initialTopicIds[2],
      user_id: systemUser.id,
      body: '校長先生の朝礼の挨拶、一番最初に言った衝撃の一言とは？'
    }
  ];

  for (const t of topics) {
    await prisma.topic.upsert({
      where: { id: t.id },
      update: {},
      create: t
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
