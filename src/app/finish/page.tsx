import { Header } from "./header"

export default function DoneView() {
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <section className="flex flex-col justify-center items-center flex-1">
        Le pusiste
      </section>
    </main>
  )
}
