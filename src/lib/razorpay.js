// Razorpay payout integration. In live mode this opens the Razorpay
// checkout sheet; in dev mode we resolve a synthetic txn id.

export async function initiateRazorpayPayout({ amount, dealRef, payeeName, upi }) {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
  if (!keyId || keyId.startsWith('rzp_test_xxx')) {
    await new Promise((r) => setTimeout(r, 600))
    return {
      ok: true,
      razorpay_id: 'pout_dev_' + Math.random().toString(36).slice(2, 10),
      upi_ref: upi ? 'UPI/' + Date.now() : null,
    }
  }

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      name: 'Creatink',
      description: `Payout for deal ${dealRef}`,
      prefill: { name: payeeName, contact: '', email: '' },
      handler: (resp) => resolve({
        ok: true, razorpay_id: resp.razorpay_payment_id, upi_ref: null,
      }),
      modal: { ondismiss: () => resolve({ ok: false }) },
      theme: { color: '#E8C68F' },
    })
    rzp.open()
  })
}
