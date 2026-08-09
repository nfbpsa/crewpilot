"use client";

type Props = {
  customerName: string;
  phone?: string | null;
  total: number;
  quoteUrl: string;
};

export default function SendQuoteButton({
  customerName,
  phone,
  total,
  quoteUrl,
}: Props) {
  function sendQuote() {
    const message = `Hi ${customerName},

Here is your estimate from Loadstar Trucking.

Estimate Total: $${total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}

View your estimate here:
${quoteUrl}

Thank you,
Loadstar Trucking`;

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");

      window.open(
        `sms:${cleanPhone}?&body=${encodeURIComponent(message)}`,
        "_self"
      );

      return;
    }

    alert("No phone number is available for this customer.");
  }

  return (
    <button
      type="button"
      onClick={sendQuote}
      className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
    >
      Send Quote
    </button>
  );
}