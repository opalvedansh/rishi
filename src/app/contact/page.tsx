"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <Container>
                <div className="mb-20 text-center">
                    <FadeIn>
                        <h1 className="font-display text-5xl md:text-6xl mb-6">Get in Touch</h1>
                        <p className="text-xl font-light text-neutral-500 max-w-xl mx-auto">
                            We'd love to hear from you. Whether you have a question about our collections, need assistance with an order, or just want to say hello.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                    {/* Contact Info */}
                    <div>
                        <FadeIn delay={0.2} direction="right">
                            <div className="space-y-12">
                                <div>
                                    <h3 className="font-display text-2xl mb-6">Visit Us</h3>
                                    <div className="flex items-start gap-4 text-neutral-500 font-light">
                                        <MapPin className="w-6 h-6 shrink-0 mt-1 text-black" />
                                        <p className="leading-relaxed">
                                            Flat no 130, Surya Vihar Part 2,<br />
                                            Sector 91, Faridabad,<br />
                                            Haryana - 121003
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-display text-2xl mb-6">Contact</h3>
                                    <div className="space-y-4 text-neutral-500 font-light">
                                        <div className="flex items-center gap-4">
                                            <Mail className="w-6 h-6 shrink-0 text-black" />
                                            <a href="mailto:Doreebysvd@gmail.com" className="hover:text-black transition-colors">Doreebysvd@gmail.com</a>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Phone className="w-6 h-6 shrink-0 text-black" />
                                            <a href="tel:+1234567890" className="hover:text-black transition-colors">+1 (234) 567-890</a>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-display text-2xl mb-6">Hours</h3>
                                    <ul className="text-neutral-500 font-light space-y-2">
                                        <li className="flex justify-between max-w-xs border-b border-neutral-100 pb-2">
                                            <span>Monday - Friday</span>
                                            <span>10:00 - 19:00</span>
                                        </li>
                                        <li className="flex justify-between max-w-xs border-b border-neutral-100 pb-2">
                                            <span>Saturday</span>
                                            <span>11:00 - 18:00</span>
                                        </li>
                                        <li className="flex justify-between max-w-xs border-b border-neutral-100 pb-2">
                                            <span>Sunday</span>
                                            <span>Closed</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Form */}
                    <div>
                        <FadeIn delay={0.3} direction="left">
                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative border-b border-neutral-300 focus-within:border-black transition-colors">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full py-4 bg-transparent outline-none placeholder:text-neutral-400 font-light"
                                        />
                                    </div>
                                    <div className="relative border-b border-neutral-300 focus-within:border-black transition-colors">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full py-4 bg-transparent outline-none placeholder:text-neutral-400 font-light"
                                        />
                                    </div>
                                </div>

                                <div className="relative border-b border-neutral-300 focus-within:border-black transition-colors">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full py-4 bg-transparent outline-none placeholder:text-neutral-400 font-light"
                                    />
                                </div>

                                <div className="relative border-b border-neutral-300 focus-within:border-black transition-colors">
                                    <textarea
                                        placeholder="Your Message"
                                        rows={4}
                                        className="w-full py-4 bg-transparent outline-none placeholder:text-neutral-400 font-light resize-none"
                                    />
                                </div>

                                <button type="submit" className="px-10 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </FadeIn>
                    </div>
                </div>
            </Container>
        </div>
    );
}
