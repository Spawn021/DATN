
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
    const handleSaveOrder = async (paymentId) => {
        const response = await apiOrders.createOrder({ ...payload, paymentId })
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
                fundingSource="paypal"
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: amount,
                                currency_code: currency,
                            },
                            payee: {
                                email_address: "sb-bipfc36109163@business.example.com"
                            }
                        },
                    ],
                }).then((orderId) => orderId)
                }
                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    console.log(response)
                    if (response.status === 'COMPLETED') {
                        const paymentId = response.purchase_units[0].payments.captures[0].id
                        handleSaveOrder(paymentId)
                    }
                })}
            />
        </>
    );
}

export default function Paypal({ amount, payload, setIsSuccess }) {
    return (
        <div style={{ width: "100%", minHeight: "10px", zIndex: 10, position: "relative" }}>
            <PayPalScriptProvider options={{ clientId: "AY3D81gsgLAqScqTIZ67UOLYb-IftE1CIQfPgbpRF8eS0imFcdSdwRmHL5G0lK1cS0S9aZ4LS5uXghQr", components: "buttons", currency: "USD" }}>
                <ButtonWrapper setIsSuccess={setIsSuccess} payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}