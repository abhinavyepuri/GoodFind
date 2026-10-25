import * as React from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
export function ContactPage() {
    const [submitted, setSubmitted] = React.useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };
    return (<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Get in Touch</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Concierge Support & Studio Inquiries
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Reach our dedicated support team or partner with us as an independent maker.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Information */}
        <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl border bg-card shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-foreground border-b pb-3">Contact Channels</h2>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-foreground">Email Support</p>
                <p className="text-muted-foreground">concierge@goodfind.io</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Average response under 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-foreground">Telephone Concierge</p>
                <p className="text-muted-foreground">+1 (800) 555-GOOD</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Mon–Fri: 9am – 8pm EST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-foreground">Studio & Showroom</p>
                <p className="text-muted-foreground">450 West 14th Street, Suite 8B</p>
                <p className="text-muted-foreground">Meatpacking District, New York, NY 10014</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl border bg-card shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-foreground border-b pb-3">Send a Message</h2>

          {submitted ? (<div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-foreground mx-auto"/>
              <h3 className="text-sm font-bold text-foreground">Message Dispatched</h3>
              <p className="text-xs text-muted-foreground">
                Thank you for contacting GoodFind Concierge. A representative will respond to your inquiry shortly.
              </p>
            </div>) : (<form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Your Name
                  </label>
                  <Input placeholder="Alexandria Morgan" required/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <Input type="email" placeholder="alex@domain.com" required/>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Subject / Inquiry Type
                </label>
                <Input placeholder="e.g. Order Tracking or Wholesale Inquiry" required/>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Your Message
                </label>
                <Textarea placeholder="How can our studio team assist you?" rows={5} required/>
              </div>

              <Button type="submit" variant="brand" className="w-full gap-2">
                <Send className="h-4 w-4"/>
                <span>Dispatch Message</span>
              </Button>
            </form>)}
        </div>
      </div>
    </div>);
}
