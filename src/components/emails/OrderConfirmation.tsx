import {
    Html,
    Body,
    Head,
    Heading,
    Hr,
    Container,
    Preview,
    Section,
    Text,
    Img,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
    selectedSize: string;
}

interface OrderConfirmationEmailProps {
    orderId: string;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    discount?: number;
    shipping: number;
    total: number;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
    };
}

export const OrderConfirmationEmail = ({
    orderId,
    customerName,
    items,
    subtotal,
    discount = 0,
    shipping,
    total,
    shippingAddress,
}: OrderConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Order Confirmation - Doree</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={{ paddingBottom: "20px" }}>
                        <Heading style={h1}>DOREE</Heading>
                        <Text style={heroText}>Thank you for your order!</Text>
                        <Text style={text}>
                            Hi {customerName}, we've received your order and are getting it ready.
                            We'll notify you when it's on the way.
                        </Text>
                        <Text style={orderNumber}>Order ID: #{orderId.slice(0, 8)}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={h2}>Order Summary</Text>
                        {items.map((item) => (
                            <Row key={item.id} style={{ marginBottom: "10px" }}>
                                <Column style={{ width: "60px" }}>
                                    <Img
                                        src={item.image}
                                        alt={item.title}
                                        width="50"
                                        height="60"
                                        style={{ objectFit: "cover", borderRadius: "4px" }}
                                    />
                                </Column>
                                <Column>
                                    <Text style={itemTitle}>{item.title}</Text>
                                    <Text style={itemMeta}>Size: {item.selectedSize} | Qty: {item.quantity}</Text>
                                </Column>
                                <Column style={{ textAlign: "right" }}>
                                    <Text style={itemPrice}>₹{item.price.toLocaleString()}</Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Row>
                            <Column style={labelColumn}>Subtotal</Column>
                            <Column style={valueColumn}>₹{subtotal.toLocaleString()}</Column>
                        </Row>
                        <Row>
                            <Column style={labelColumn}>Shipping</Column>
                            <Column style={valueColumn}>
                                {shipping === 0 ? "Free" : `₹${shipping}`}
                            </Column>
                        </Row>
                        {discount > 0 && (
                            <Row>
                                <Column style={{ ...labelColumn, color: "green" }}>Discount</Column>
                                <Column style={{ ...valueColumn, color: "green" }}>-₹{discount.toLocaleString()}</Column>
                            </Row>
                        )}
                        <Hr style={{ margin: "10px 0", borderColor: "#eaeaea" }} />
                        <Row>
                            <Column style={totalLabel}>Total</Column>
                            <Column style={totalValue}>₹{total.toLocaleString()}</Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={h2}>Shipping Address</Text>
                        <Text style={address}>
                            {shippingAddress.address}<br />
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={footer}>
                        <Text style={footerText}>
                            If you have any questions, reply to this email or contact us at Doreebysvd@gmail.com
                        </Text>
                        <Text style={footerCopyright}>
                            © {new Date().getFullYear()} Doree. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default OrderConfirmationEmail;

// Styles
const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "560px",
};

const h1 = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "0 0 20px",
    letterSpacing: "4px",
};

const heroText = {
    fontSize: "24px",
    lineHeight: "1.3",
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center" as const,
    margin: "0 0 10px",
};

const text = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#4a4a4a",
    margin: "0 0 20px",
};

const orderNumber = {
    fontSize: "14px",
    color: "#8898aa",
    marginBottom: "20px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const h2 = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 15px",
};

const itemTitle = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
    color: "#1a1a1a",
};

const itemMeta = {
    fontSize: "12px",
    color: "#696969",
    margin: "4px 0 0",
};

const itemPrice = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
};

const labelColumn = {
    fontSize: "14px",
    color: "#696969",
    padding: "5px 0",
};

const valueColumn = {
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "right" as const,
    padding: "5px 0",
};

const totalLabel = {
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px 0",
};

const totalValue = {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "right" as const,
    padding: "10px 0",
};

const address = {
    fontSize: "14px",
    lineHeight: "24px",
    color: "#4a4a4a",
};

const footer = {
    textAlign: "center" as const,
};

const footerText = {
    fontSize: "12px",
    color: "#8898aa",
    marginBottom: "10px",
};

const footerCopyright = {
    fontSize: "12px",
    color: "#8898aa",
};
