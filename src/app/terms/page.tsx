"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";

export default function TermsPage() {
    return (
        <Container className="py-24 md:py-32">
            <FadeIn>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl mb-8">Terms of Service</h1>
                    <div className="prose prose-neutral hover:prose-a:text-black">
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Last updated: January 29, 2026
                        </p>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">1. Introduction</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Welcome to Doree. By accessing our website and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">2. Online Store Terms</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">3. Products and Services</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">4. Pricing and Billing</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                            </p>
                        </section>
                    </div>
                </div>
            </FadeIn>
        </Container>
    );
}
