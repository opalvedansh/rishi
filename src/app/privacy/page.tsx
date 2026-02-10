"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";

export default function PrivacyPage() {
    return (
        <Container className="py-24 md:py-32">
            <FadeIn>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl mb-8">Privacy Policy</h1>
                    <div className="prose prose-neutral">
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Last updated: February 10, 2026
                        </p>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">1. Information We Collect</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                When you visit our website or make a purchase, we collect certain information about you, including:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and billing address provided during checkout.</li>
                                <li><strong>Payment Information:</strong> Payment details are processed securely through Razorpay. We do not store your credit card or bank details on our servers.</li>
                                <li><strong>Device Information:</strong> IP address, browser type, operating system, and browsing behaviour on our site.</li>
                                <li><strong>Order Information:</strong> Products purchased, order value, and transaction history.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">2. How We Use Your Information</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We use the information we collect for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li>To process and fulfil your orders, including shipping and delivery.</li>
                                <li>To communicate with you about your order status, shipping updates, and customer support.</li>
                                <li>To send promotional emails and updates about new collections (you can opt out at any time).</li>
                                <li>To improve our website, products, and services based on your feedback and browsing patterns.</li>
                                <li>To detect and prevent fraud or unauthorized transactions.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">3. Consent</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                When you provide us with personal information to complete a transaction, verify your payment method, place an order, arrange for a delivery, or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only. If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
                            </p>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                If after you opt-in, you change your mind, you may withdraw your consent for us to contact you by emailing us at <a href="mailto:Doreebysvd@gmail.com" className="text-black underline">Doreebysvd@gmail.com</a>.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">4. Third-Party Services</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We use the following third-party services to operate our store:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li><strong>Razorpay:</strong> For secure payment processing. Razorpay&apos;s privacy policy governs the handling of your payment data.</li>
                                <li><strong>Vercel:</strong> For website hosting and delivery.</li>
                                <li><strong>Supabase:</strong> For secure data storage.</li>
                            </ul>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                These third-party providers will only collect, use, and disclose your information to the extent necessary to allow them to perform the services they provide to us.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">5. Cookies</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We use cookies and similar technologies to enhance your browsing experience. Cookies help us remember your preferences, keep items in your shopping cart, and understand how you interact with our website. You can control cookie settings through your browser preferences.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">6. Data Retention</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We retain your personal information for as long as necessary to provide you with our services, comply with our legal obligations, resolve disputes, and enforce our agreements. Order records are maintained for accounting and tax purposes as required by Indian law.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">7. Security</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed. All payment transactions are encrypted using SSL/TLS technology, and payment data is handled exclusively by Razorpay&apos;s PCI-DSS compliant infrastructure.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">8. Disclosure</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We may disclose your personal information if we are required by law to do so, if you violate our Terms of Service, or to protect the rights, property, or safety of Doree, our customers, or others.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">9. Changes to This Policy</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We reserve the right to modify this privacy policy at any time. Changes will take effect immediately upon posting to the website. We encourage you to review this policy periodically. Your continued use of our website after changes are posted constitutes your acceptance of the revised policy.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">10. Contact Us</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy or would like to exercise your data rights, please contact us:
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
