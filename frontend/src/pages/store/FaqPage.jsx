import { AccordionItem } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function FaqPage() {
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Help & Answers</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Everything you need to know about purchasing, shipping speeds, warranty guarantees, and our commerce platform.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-soft space-y-2">
        <AccordionItem title="How does carbon-neutral express shipping work?" defaultOpen={true}>
          All domestic orders over ₹150 qualify for complimentary carbon-neutral 2-day delivery. We partner with verified carbon offset initiatives and certified freight carriers who prioritize route optimization and recyclable paper air packaging.
        </AccordionItem>

        <AccordionItem title="What is the 30-Day Open Box Guarantee?">
          We want you to experience our objects in your daily life. You have 30 calendar days from the date of delivery to test our products. If you are not thoroughly delighted, contact our concierge support team for a prepaid courier return label and a 100% refund.
        </AccordionItem>

        <AccordionItem title="How do I track my order?">
          Upon completing checkout, you are provided with an order confirmation and tracking number. You can inspect your shipment milestone timeline, carrier dispatch details, and estimated delivery status anytime via the Track Order tool.
        </AccordionItem>

        <AccordionItem title="What payment methods are supported?">
          We support all major payment cards including Visa, Mastercard, American Express, Apple Pay, Google Pay, and Shop Pay. Transactions are processed securely in demonstration mode without storing card details.
        </AccordionItem>

        <AccordionItem title="How are product warranties handled?">
          All hardware and furniture items carry comprehensive 2 to 10 year structural warranties. Digital products receive lifetime updates. If any defect arises, our concierge team will dispatch a replacement advance unit immediately.
        </AccordionItem>
      </div>

      <div className="p-6 rounded-2xl border bg-muted/40 text-center space-y-3">
        <h3 className="font-bold text-foreground">Have a specific inquiry?</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Our customer concierge team is available 7 days a week to assist with order tracking, custom configurations, or bespoke requests.
        </p>
        <Link to="/contact">
          <Button variant="brand" size="sm">Contact Concierge</Button>
        </Link>
      </div>
    </div>);
}
