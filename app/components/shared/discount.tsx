"use client";

import Image from "next/image";

export default function DiscountCoupoun() {
    return (
        <div className="absolute bottom-[18px] right-[32px] z-30 w-[min(430px,46%)] rounded-[18px] border border-white/15 bg-white/10 p-3.5 text-primary-foreground shadow-[0_20px_30px_rgba(34,81,56,0.18)] backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-2.5 text-[0.75rem] tracking-[0.02em] text-primary-foreground/80">
                        <span>Kupon Diskon</span>
                        <div className="flex items-center gap-3.5 text-[0.7rem]">
                          <button type="button" className="bg-transparent p-0 text-primary-foreground/80"> Sebelumnya</button>
                          <button type="button" className="bg-transparent p-0 text-primary-foreground/80">Berikutnya </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[88px_1fr_auto_auto] items-center gap-3.5 pt-3">
                        <div className="h-[88px] w-[88px] overflow-hidden rounded-[14px] bg-caramel">
                          <Image
                            src="https://images.pexels.com/photos/8697516/pexels-photo-8697516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                            alt="Truffle Pasta"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-col gap-1">
                          <strong className="text-[1.2rem] font-bold tracking-[-0.04em]">Truffle Pasta</strong>
                          <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-primary-foreground/75">
                            <i className="inline-block h-2 w-2 rounded-full bg-caramel" /> 78 Kalori
                          </span>
                        </div>

                        <div className="ml-2 flex flex-col items-end gap-1 text-primary-foreground">
                          <del className="text-[0.78rem] text-primary-foreground/55 line-through">$9.90</del>
                          <strong className="text-[2.2rem] font-bold tracking-[-0.07em] text-caramel">$7.90</strong>
                        </div>
                      </div>
                    </div>
    )
}