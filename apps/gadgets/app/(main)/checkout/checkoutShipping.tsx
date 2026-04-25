"use client";

import { form } from "framer-motion/m";
import { CheckoutForm } from "./checkoutLayout";

type Props = {
  form: CheckoutForm;
  onChange: (key: keyof CheckoutForm, value: string) => void;
};

type NigeriaState =
  | "Lagos"
  | "FCT - Abuja"
  | "Rivers"
  | "Kano"
  | "Oyo";

const nigeriaStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara"
];

const nigeriaCitiesByState: Record<NigeriaState, string[]> = {
  Lagos: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Ajah", "Epe", "Ikorodu"],
  "FCT - Abuja": ["Abuja", "Gwarinpa", "Maitama", "Wuse", "Asokoro", "Kubwa"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Bonny", "Eleme"],
  Kano: ["Kano", "Fagge", "Nasarawa", "Gwale"],
  Oyo: ["Ibadan", "Ogbomosho", "Iseyin", "Oyo"],
};

export default function CheckoutShipping({ form, onChange }: Props) {
  const cities = nigeriaCitiesByState[form.billing_state as NigeriaState] || [];
  
  return (
    <section className="card">
      <h4 className="section-title">Shipping Address</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className="input"
          value={form.billing_house_number}
          onChange={(e) => onChange("billing_house_number", e.target.value)}
          placeholder="House number"
        />
        <input
          className="input"
          name="street-address"
          autoComplete="street-address"
          value={form.billing_street}
          onChange={(e) => onChange("billing_street", e.target.value)}
          placeholder="Street"
        />
        <input
          className="input"
          list="cities"
          value={form.billing_city}
          onChange={(e) => onChange("billing_city", e.target.value)}
          placeholder="City"
        />

        <datalist id="cities">
          {cities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        <input
          className="input"
          list="states"
          value={form.billing_state}
          onChange={(e) => onChange("billing_state", e.target.value)}
          placeholder="State"
        />

        <datalist id="states">
          {nigeriaStates.map((state) => (
            <option key={state} value={state} />
          ))}
        </datalist>
        <input
          className="input sm:col-span-2"
          value={form.billing_landmark}
          onChange={(e) => onChange("billing_landmark", e.target.value)}
          placeholder="Landmark"
        />
      </div>
    </section>
  );
}
