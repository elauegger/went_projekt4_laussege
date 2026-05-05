// app/people/page.tsx

import { getPeople } from "@/app/actions/people";

// app/people/page.tsx
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PeoplePage() {
  const people = await getPeople()

  return (
    <main>
      <h1>People</h1>

      {people.length === 0 && <p>No people found.</p>}

      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link href={`/people/${person.id}`}>
              {person.lastname}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

