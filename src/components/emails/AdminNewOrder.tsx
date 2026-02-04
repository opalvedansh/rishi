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
    Button,
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

interface AdminNewOrderEmailProps {
    orderId: string;
    customerName: string;
    customerEmail: string;
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

export const AdminNewOrderEmail = ({
    orderId,
    customerName,
    customerEmail,
    items,
    subtotal,
    discount = 0,
    shipping,
    total,
    shippingAddress,
}: AdminNewOrderEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New Order #{orderId.slice(0, 8)} - Doree Admin</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={{ paddingBottom: "20px" }}>
                        <Heading style={h1}>New Order Received! 🎉</Heading>
                        <Text style={heroText}>You have a new order from {customerName}.</Text>
                        <Text style={orderNumber}>Order ID: #{orderId.slice(0, 8)}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={h2}>Customer Details</Text>
                        <Text style={text}>
                            <strong>Name:</strong> {customerName}<br />
                            <strong>Email:</strong> {customerEmail}<br />
                            <strong>Address:</strong><br />
                            {shippingAddress.address}<br />
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                        </Text>
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
                            <Column style={totalLabel}>Total Revenue</Column>
                            <Column style={totalValue}>₹{total.toLocaleString()}</Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    <Section style={{ textAlign: "center", padding: "20px 0" }}>
                        <Button
                            style={button}
                            href={`https://doree.in/admin/orders/${orderId}`} // Adjust domain if needed
                        >
                            View Order in Admin Panel
                        </Button>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default AdminNewOrderEmail;

// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 20px",
    width: "560px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    marginTop: "40px",
};

const h1 = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "0 0 20px",
    color: "#000",
};

const heroText = {
    fontSize: "18px",
    lineHeight: "1.3",
    color: "#4a4a4a",
    textAlign: "center" as const,
    margin: "0 0 10px",
};

const text = {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#4a4a4a",
    margin: "0 0 10px",
};

const orderNumber = {
    fontSize: "14px",
    color: "#8898aa",
    textAlign: "center" as const,
    marginBottom: "20px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const h2 = {
    fontSize: "16px",
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
    color: "#000"
};

const totalValue = {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "right" as const,
    padding: "10px 0",
    color: "#000"
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
};
