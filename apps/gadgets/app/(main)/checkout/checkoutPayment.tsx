"use client";

export default function CheckoutPayment() {
  return (
    <section className="card">
      <h4 className="section-title">Payment Method</h4>

      <div className="border rounded-lg p-4 flex items-center gap-3">
        <input type="radio" checked readOnly />
        {/* <span className="font-medium">Paystack (Card / Bank Transfer)</span> */}
        <span className="font-medium">Nomba (Card )</span>
      </div>
    </section>
  );
}
