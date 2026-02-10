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
                            Last updated: February 10, 2026
                        </p>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">1. Introduction</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Welcome to Doree (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing our website at <a href="https://www.doreeclothing.com" className="text-black underline">www.doreeclothing.com</a> and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully before using our services. If you do not agree with any part of these terms, you must not use our website.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">2. Online Store Terms</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                By agreeing to these Terms of Service, you represent that you are at least 18 years of age or the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose, nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws). A breach or violation of any of the Terms will result in immediate termination of your services.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">3. Products and Services</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our <a href="/refund-policy" className="text-black underline">Refund &amp; Cancellation Policy</a>. We have made every effort to display as accurately as possible the colours and images of our products. However, we cannot guarantee that your monitor&apos;s display of any colour will be accurate. We reserve the right to limit the quantities of any products or services that we offer.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">4. Pricing and Payment</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any product without notice at any time.
                            </p>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Payments are processed securely through Razorpay. We accept UPI, credit/debit cards, net banking, and other payment methods supported by Razorpay. By providing your payment information, you authorize us to charge the total amount of your order.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">5. User Accounts</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">6. Accuracy of Information</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions. Any reliance on the material on this site is at your own risk.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">7. Prohibited Uses</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-600 leading-relaxed mb-4 space-y-2">
                                <li>For any unlawful purpose or to solicit others to perform unlawful acts.</li>
                                <li>To violate any international, national, or local regulations, rules, laws, or ordinances.</li>
                                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
                                <li>To submit false or misleading information.</li>
                                <li>To upload or transmit viruses or any other type of malicious code.</li>
                                <li>To interfere with or circumvent the security features of the Service.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">8. Limitation of Liability</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                In no case shall Doree, our directors, officers, employees, affiliates, agents, contractors, or suppliers be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including but not limited to lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, arising from your use of the service or any products procured through the service.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">9. Governing Law</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts in Faridabad, Haryana, India.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">10. Changes to Terms</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We reserve the right to update, change, or replace any part of these Terms of Service at our sole discretion. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website following the posting of any changes constitutes acceptance of those changes.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">11. Contact Us</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Questions about the Terms of Service should be sent to us:
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
