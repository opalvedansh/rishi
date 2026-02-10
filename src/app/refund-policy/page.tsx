"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";

export default function RefundPolicyPage() {
    return (
        <Container className="py-24 md:py-32">
            <FadeIn>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl mb-8">Refund &amp; Cancellation Policy</h1>
                    <div className="prose prose-neutral">
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Last updated: February 10, 2026
                        </p>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">1. Cancellation Policy</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Orders can be cancelled within 24 hours of placing the order. Once the order has been shipped, it cannot be cancelled. To cancel an order, please contact us at <a href="mailto:Doreebysvd@gmail.com" className="text-black underline">Doreebysvd@gmail.com</a> or call us at <a href="tel:+918510803096" className="text-black underline">+91 85108 03096</a> with your order ID.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">2. Refund Eligibility</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We offer refunds under the following conditions:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li>The product is damaged or defective upon delivery.</li>
                                <li>The wrong product was delivered.</li>
                                <li>The product significantly differs from what was shown on the website.</li>
                                <li>A return request is raised within 14 days of receiving the product.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">3. Non-Refundable Items</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                The following items are not eligible for refunds:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li>Items that have been worn, washed, or altered.</li>
                                <li>Items without original tags and packaging.</li>
                                <li>Sale or discounted items (unless defective).</li>
                                <li>Gift cards.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">4. Refund Process</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                To initiate a refund, please follow these steps:
                            </p>
                            <ol className="list-decimal pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li>Email us at <a href="mailto:Doreebysvd@gmail.com" className="text-black underline">Doreebysvd@gmail.com</a> with your order number and reason for the refund.</li>
                                <li>Our team will review your request and respond within 2 business days.</li>
                                <li>If approved, you will receive instructions for returning the item.</li>
                                <li>Once we receive and inspect the returned item, your refund will be processed.</li>
                            </ol>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">5. Refund Timeline</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Once your return is received and inspected, we will notify you via email. If the refund is approved:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li><strong>UPI / Net Banking:</strong> Refund will be credited within 5-7 business days.</li>
                                <li><strong>Credit / Debit Card:</strong> Refund will be credited within 7-10 business days.</li>
                                <li><strong>Store Credit:</strong> Issued within 24 hours of approval.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">6. Exchange Policy</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We offer exchanges for items of equal or lesser value. If you wish to exchange for a higher-value item, you will need to pay the difference. Exchanges are subject to product availability.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">7. Return Shipping</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                For returns due to defective or incorrect products, we will cover the return shipping cost. For all other returns, the customer is responsible for return shipping charges.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">8. Contact Us</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                If you have any questions about our Refund &amp; Cancellation Policy, please contact us:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li>Email: <a href="mailto:Doreebysvd@gmail.com" className="text-black underline">Doreebysvd@gmail.com</a></li>
                                <li>Phone: <a href="tel:+918510803096" className="text-black underline">+91 85108 03096</a></li>
                                <li>Address: Flat no 130, Surya Vihar Part 2, Sector 91, Faridabad, Haryana - 121003</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </FadeIn>
        </Container>
    );
}
