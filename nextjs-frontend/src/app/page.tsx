import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">

      <section className="text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Stock Game</h1>
        <p className="text-lg">Learn, Invest, and Win!</p>
        <div className="mt-8 rounded-lg shadow overflow-hidden">
          <Image
            src="/stocks.png"
            alt="Stock Market"
            width={800}
            height={500}
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Trade with wisdom, not emotion</h2>
      </section>
      
      <Footer />
    </main>

  );
}
