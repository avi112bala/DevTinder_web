import { useState } from "react";
import { Check, Award, Crown, Gem } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../api/apiservices";
import { toast } from "sonner";

const TIERS = [
  {
    id: "silver",
    name: "Silver",
    icon: Award,
    price: 290,
    tagline: "Get started",
    metal: {
      base: "#C8CCD1",
      mid: "#9AA0A8",
      deep: "#6B7178",
      shine: "#F2F4F6",
      text: "#E8EAED",
    },
    features: ["3 active projects", "5 GB storage", "Community support", "Basic analytics"],
  },
  {
    id: "gold",
    name: "Gold",
    icon: Crown,
    price: 900,
    tagline: "Most chosen",
    metal: {
      base: "#D9A94E",
      mid: "#B8842C",
      deep: "#8A5F1B",
      shine: "#F7DFA0",
      text: "#FBEACB",
    },
    features: ["Unlimited projects", "100 GB storage", "Priority support", "Advanced analytics", "Custom domains"],
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: Gem,
    price: 7900,
    tagline: "Full access",
    metal: {
      base: "#DCE6EA",
      mid: "#9FB4C0",
      deep: "#5E7A8A",
      shine: "#FFFFFF",
      text: "#EAF3F7",
    },
    features: [
      "Unlimited everything",
      "1 TB storage",
      "24/7 dedicated support",
      "Advanced analytics + exports",
      "Custom domains",
      "White-glove onboarding",
    ],
  },
];

interface Tier {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  price: number;
  tagline: string;
  metal: {
    base: string;
    mid: string;
    deep: string;
    shine: string;
    text: string;
  };
  features: string[];
}

interface TierCardProps {
  tier: Tier;
  featured?: boolean;
  onChoose: (id: string, price: number) => void;
  isLoading?: boolean;
}

function TierCard({ tier, featured, onChoose, isLoading }: TierCardProps) {
  const [hovered, setHovered] = useState(false);
  const { metal } = tier;
  const Icon = tier.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative grow rounded-2xl overflow-hidden transition-transform duration-300 ${featured ? "md:-translate-y-2" : ""
        }`}
      style={{
        background: `linear-gradient(155deg, ${metal.shine} 0%, ${metal.base} 22%, ${metal.mid} 55%, ${metal.deep} 100%)`,
        boxShadow: featured
          ? `0 20px 45px -12px ${metal.deep}99, 0 0 0 1px ${metal.shine}55 inset`
          : `0 12px 30px -14px ${metal.deep}80, 0 0 0 1px ${metal.shine}33 inset`,
      }}
    >
      {/* moving sheen */}
      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          background: `linear-gradient(115deg, transparent 20%, ${metal.shine}55 45%, ${metal.shine}aa 50%, ${metal.shine}55 55%, transparent 80%)`,
          transform: hovered ? "translateX(60%)" : "translateX(-120%)",
        }}
      />

      {featured && (
        <div
          className="absolute top-0 right-0 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-bl-lg"
          style={{ background: metal.deep, color: metal.shine }}
        >
          Best value
        </div>
      )}

      <div className="relative p-7 flex flex-col h-full">
        <div
          className="w-11 h-11 rounded-full grid place-items-center mb-5"
          style={{ background: `${metal.deep}30`, border: `1px solid ${metal.deep}55` }}
        >
          <Icon size={20} strokeWidth={1.75} color={metal.deep} />
        </div>

        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-1"
          style={{ color: metal.deep }}
        >
          {tier.tagline}
        </p>
        <h3
          className="text-2xl font-bold mb-4"
          style={{
            fontFamily: "'Fraunces', serif",
            color: metal.deep,
            textShadow: `0 1px 0 ${metal.shine}80`,
          }}
        >
          {tier.name}
        </h3>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-bold" style={{ color: metal.deep }}>
            ₹{tier.price}
          </span>
          <span className="text-sm font-medium" style={{ color: `${metal.deep}cc` }}>
            /mo
          </span>
        </div>

        <ul className="flex flex-col gap-2.5 mb-7 grow">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm" style={{ color: `${metal.deep}e6` }}>
              <Check size={16} className="mt-0.5 shrink-0" color={metal.deep} strokeWidth={2.5} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          disabled={isLoading}
          onClick={() => onChoose(tier.id, tier.price)}
          className="w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: metal.deep, color: metal.shine }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Processing…
            </>
          ) : (
            <>Choose {tier.name}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Primium() {
  const { mutate: createOrder, isPending, variables } = useMutation({
    mutationFn: ({ membershipType, price }: { membershipType: string; price: number }) =>
      apiService.post({
        url: "/payment/create-order",
        payload: { membershipType, price },
      }),
    onSuccess: (data: any) => {
      toast.success(
        data?.message ?? "Order created! Redirecting to payment…",
        { position: "top-right" }
      );
      // TODO: integrate Razorpay / payment gateway here using data.orderId
      console.log("Payment order response:", data);
      const options = {
        key: data?.keyId,
        amount: data.amount, // in paise
        currency: data.currency,
        name: "DevTinder",
        description: "Premium Membership",
        image: "/logo.png",
        order_id: data.id,
        // handler: function (response: any) {
        //   // payment successful - call API to verify
        //   console.log(response);
        //   axios.post("/payment/verify", {
        //     response,
        //     orderId: data.id,
        //     membershipType: data.membershipType,
        //   })
        //     .then(() => toast.success("Payment successful!"))
        //     .catch(() => toast.error("Payment verification failed"));
        // },
        prefill: {
          name: data.notes.firstName + ' ' + data.notes.lastName,
          email: data.notes.email,
          contact: "9999999999"
        },
        notes: data?.notes,
        theme: { color: "#333333" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ?? "Failed to create order. Please try again.";
      toast.error(msg, { position: "top-right" });
    },
  });

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-8"
      style={{ background: "#15171B" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&display=swap');`}</style>
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-2">
            Membership
          </p>
          <h2 className="text-3xl font-bold text-neutral-100" style={{ fontFamily: "'Fraunces', serif" }}>
            Choose your tier
          </h2>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-5 items-stretch">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              featured={tier.id === "platinum"}
              onChoose={(membershipType: string, price: number) => createOrder({ membershipType, price })}
              isLoading={isPending && variables?.membershipType === tier.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}