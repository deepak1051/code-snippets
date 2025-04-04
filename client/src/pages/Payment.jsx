import axios from 'axios';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const handlePayment = async () => {
    try {
      const res = await loadRazorpay();
      console.log(res);
      if (!res) {
        alert('Razorpay SDK failed to load');
        return;
      }

      const { data } = await axios.post(
        'http://localhost:5000/api/orders/create-order',
        {
          amount: 100,
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        handler: async function (response) {
          console.log('response', response);
          const { data } = await axios.post(
            'http://localhost:5000/api/orders/verify-payment',

            response
          );
          console.log(data);
        },

        theme: { color: '#D81B60' },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      console.log('error');
    }
  };
  return (
    <div
      className="p-4 border cursor-pointer bg-pink-600 w-64"
      onClick={handlePayment}
    >
      Payment{' '}
    </div>
  );
}
