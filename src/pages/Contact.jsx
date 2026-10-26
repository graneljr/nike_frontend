import { Clock3, Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    label: "Email",
    value: "armandogranel2@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "09123456778",
    icon: Phone,
  },
  {
    label: "Visit us",
    value: "Rizal Nueva Ecija",
    icon: MapPin,
  },
];

const openingHours = [
  { day: "Monday – Friday", hours: "8am - 7 pm" },
  { day: "Saturday – Sunday", hours: "9am - 5pm" },
];

function Contact() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="grid gap-8 border-b border-zinc-200 pb-10 sm:gap-12 sm:pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            Contact
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black uppercase leading-[0.98] tracking-tighter sm:text-6xl lg:text-7xl">
            We’re here to help.
          </h1>
        </div>
        <p className="max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg lg:justify-self-end">
          Have a question about a pair, an order, or finding the right fit? Get
          in touch with the shop or stop by in person.
        </p>
      </div>

      <div className="grid gap-5 pt-8 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {contactDetails.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="grid grid-cols-[3rem_1fr] items-start gap-4 py-6 sm:grid-cols-[3.5rem_1fr] sm:py-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-800">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  {label}
                </h2>
                <p className="mt-2 break-words text-lg font-medium text-zinc-950 sm:text-xl">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="flex min-h-64 flex-col justify-between bg-black p-6 text-white sm:min-h-72 sm:p-8 lg:p-10">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
              <Clock3 aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Store hours
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Plan your visit. We’d love to see you.
            </p>
          </div>

          <dl className="mt-8 space-y-4 border-t border-zinc-800 pt-5">
            {openingHours.map(({ day, hours }) => (
              <div
                className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                key={day}
              >
                <dt className="text-zinc-400">{day}</dt>
                <dd className="font-medium text-white">{hours}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

    </section>
  );
}

export default Contact;
