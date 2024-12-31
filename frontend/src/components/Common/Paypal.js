
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import { apiOrders } from "../../redux/apis";

// This value is from the props in the UI
const style = { "layout": "vertical" };

const ButtonWrapper = ({ currency, showSpinner, amount, payload, setIsSuccess }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency
            }
        });
    }, [currency, showSpinner]);
    const handleSaveOrder = async () => {
        const response = await apiOrders.createOrder(payload)
        if (response.success) {
            setIsSuccess(true)
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Your order has been placed successfully.',
                }).then(() => {
                    navigate('/')
                })
            }, 1500)
        }
    }

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: amount,
                                currency_code: currency,
                            },
                        },
                    ],
                }).then((orderId) => orderId)
                }
                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    if (response.status === 'COMPLETED') {
                        handleSaveOrder()
                    }
                })}
            />
        </>
    );
}

export default function Paypal({ amount, payload, setIsSuccess }) {
    return (
        <div style={{ width: "100%", minHeight: "10px", zIndex: 10, position: "relative" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper setIsSuccess={setIsSuccess} payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}