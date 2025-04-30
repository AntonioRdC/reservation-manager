import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveIframe } from './calendar-iframe';

export default async function CalendarAdminPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className='className="text-lg lg:text-2xl font-medium text-rose-500 mb-6"'>
            Calendário Integrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveIframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FPorto_Velho&showPrint=0&src=YW50b25pb3JpYmVpcm9hbWdAZ21haWwuY29t&color=%23039BE5" />
        </CardContent>
      </Card>
    </section>
  );
}
