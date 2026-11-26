import { ArrowRight, Compass, CookingPot, Heart } from "lucide-react"
import { Reveal } from "./reveal"

const steps = [
  {
    number: "01",
    title: "Explore",
    description: "Discover local pizza restaurants and browse their menus.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Choose",
    description: "Select your favorite pizza and place your order.",
    icon: CookingPot,
  },
  {
    number: "03",
    title: "Enjoy",
    description: "Receive your order and enjoy every bite.",
    icon: Heart,
  },
]

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 overflow-hidden bg-[#f3e8da] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#d62828] uppercase">
              Simple as one, two, yum
            </p>
            <h2 className="font-display max-w-2xl text-4xl leading-[1.05] font-medium tracking-[-0.045em] text-[#25201d] sm:text-5xl lg:text-[58px]">
              Three steps to a
              <span className="block text-[#d62828] italic sm:ml-2 sm:inline">
                better bite.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#82776f]">
            Great pizza shouldn&apos;t take a complicated plan. We keep it easy.
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          <div className="absolute top-8 right-[16%] left-[16%] hidden border-t border-dashed border-[#cbb49b] md:block" />
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <Reveal
                key={step.number}
                delay={index * 0.1}
                className="relative"
              >
                <div className="flex gap-5 md:block">
                  <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full border border-[#dec8ae] bg-[#fff8ed] text-[#d62828] shadow-[0_8px_20px_rgba(65,44,25,0.06)] md:mb-7">
                    <Icon size={23} strokeWidth={1.7} />
                    <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-[#d62828] text-[10px] font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <div className="pb-3 md:pb-0">
                    <h3 className="font-display text-2xl font-medium text-[#25201d] sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#82776f]">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      size={17}
                      className="absolute top-5 right-1 hidden text-[#c6ad92] md:block"
                    />
                  )}
                  {index < steps.length - 1 && (
                    <span className="absolute top-16 bottom-0 left-[31px] border-l border-dashed border-[#cbb49b] md:hidden" />
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
