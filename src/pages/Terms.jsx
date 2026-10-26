import { Link } from "react-router-dom";

const termsSections = [
  {
    number: "01",
    title: "Using the store",
    paragraphs: [
      "These terms apply when you browse this website, create an account, or place an order through the store. By using the site, you agree to follow them.",
    ],
  },
  {
    number: "02",
    title: "Products, prices, and availability",
    paragraphs: [
      "We aim to show product descriptions, sizes, images, and prices as accurately as possible. Colors can look different on different screens, and availability can change as orders are placed.",
      "Prices are shown in Philippine pesos (₱). The amount displayed for your order at checkout is the amount recorded for that order. If you notice an error in a listing or order total, contact us before completing the purchase.",
    ],
  },
  {
    number: "03",
    title: "Orders and account details",
    paragraphs: [
      "When placing an order, provide accurate account, contact, size, and delivery details. You are responsible for keeping your account sign-in details private and for activity carried out through your account.",
      "You can review your order and its status in the store. If you spot a mistake in your order or delivery information, contact the shop as soon as possible so we can check whether it can still be updated.",
    ],
  },
  {
    number: "04",
    title: "Payment",
    paragraphs: [
      "Available payment methods are shown at checkout. For cash on delivery, payment is due when the order arrives. For online payment, an order is treated as paid only when the store records a successful payment status.",
    ],
  },
  {
    number: "05",
    title: "Delivery and order updates",
    paragraphs: [
      "Orders are sent to the delivery address entered at checkout. Please make sure the address and contact details are complete. Delivery timing may vary based on the destination and delivery service.",
      "Order status may be updated as the order is processed and shipped. Once a shipped order arrives, you can confirm receipt from your account.",
    ],
  },
  {
    number: "06",
    title: "Cancellations, returns, and exchanges",
    paragraphs: [
      "The store currently allows customers to cancel an order while it is processing. Once an order has shipped, use the order page to confirm receipt when it arrives, or contact the shop if there is a problem.",
      "Contact us before sending an item back or requesting an exchange. The shop will confirm whether the item and order are eligible and explain the next steps.",
    ],
  },
  {
    number: "07",
    title: "Website use",
    paragraphs: [
      "Use the website lawfully and do not interfere with its operation, attempt to access another customer's account, or submit information that is false or misleading.",
    ],
  },
  {
    number: "08",
    title: "Changes and questions",
    paragraphs: [
      "Store details, products, and these terms may be updated as the shop changes. The terms shown on this page apply when you use the store. If you have a question about an order or these terms, please contact us.",
    ],
  },
];

function Terms() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="grid gap-8 border-b border-zinc-200 pb-10 sm:gap-12 sm:pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            Store policies
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black uppercase leading-[0.98] tracking-tighter sm:text-6xl lg:text-7xl">
            Terms &amp; conditions.
          </h1>
        </div>
        <p className="max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg lg:justify-self-end">
          A clear guide to shopping with us, from placing an order to receiving
          your pair. Please read these terms before using the store.
        </p>
      </div>

      <div className="grid gap-10 pt-8 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {termsSections.map(({ number, title, paragraphs }) => (
            <section
              key={number}
              className="grid gap-3 py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5 sm:py-8"
            >
              <span className="text-xs font-bold tracking-widest text-zinc-400">
                {number}
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                  {title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-600 sm:text-base">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <aside className="h-fit bg-black p-6 text-white sm:p-8 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Need a hand?
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            We’re here to help.
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Reach out to the shop with questions about an order, cancellation,
            return, or exchange.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Contact us
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Terms;
