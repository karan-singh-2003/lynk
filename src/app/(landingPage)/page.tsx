import Navbar from '@/components/LandingPage/Navbar'
import { MoveUpRight } from 'lucide-react'
export default function Home() {
  return (
    <div className="flex flex-col  justify-center mt-5 lg:w-[800px] mx-auto ">
      <div className="bg-gradient-to-b px-5 py-2 from-white to-[#7EC9FF]/50 ">
        <Navbar />

        <div className="text-center lg:w-[600px] mx-auto mt-20">
          <div className="my-5">
            <div className="my-5 relative overflow-hidden">
              <button className="relative z-10 border border-[#BABABA] rounded-full px-1 py-1.5 bg-white/80 hover:bg-[#f5f5f5] hover:drop-shadow-lg transition-all duration-300">
                <div className="flex">
                  <div className="bg-[#246EFF] rounded-full text-white px-2 text-[8px] py-[2px] mx-1 flex items-center justify-center leading-none">
                    New
                  </div>
                  <div className="mx-1">
                    <div className="flex items-center gap-1">
                      <h1 className="text-[11px] lg:text-[12px] text-[#696767] font-medium">
                        Book a free 15 min demo
                      </h1>
                      <MoveUpRight size={15} className="text-[#696767]" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <h1 className="font-bold  lg:text-[48px] text-[40px] leading-[1.1]">
            Short links with superpowers
          </h1>
          <div>
            <h1 className="text-[#525252] font-medium text-[14px] leading-tight mt-6">
              <span className="block">
                Lync is the modern link management platform for
              </span>
              entrepreneurs, creators, and growth teams
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
