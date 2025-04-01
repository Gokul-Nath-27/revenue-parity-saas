# My App

A Next.js application with TypeScript, Tailwind CSS, and Drizzle ORM.

## Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment:
   - Create the .env
   - Add your Neon database URL to `NEXT_APP_NEON_DATABASE_URL`

3. Setup database:
```bash
pnpm db:generate
pnpm db:push
```

4. Start development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Neon (PostgreSQL) + Drizzle ORM
- Radix UI + next-themes

## Scripts

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:studio` - Database management
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
