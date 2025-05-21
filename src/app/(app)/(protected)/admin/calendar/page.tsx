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
          <ResponsiveIframe src={process.env.IFRAME_CALENDAR || ''} />
        </CardContent>
      </Card>
    </section>
  );
}
