import AuthGuard from '@/components/AuthGuard';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';

export default function NewPropertyPage() {
    return (
        <AuthGuard>
            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <PageHeader title="New Property" />
                    <Card>
                        <CardBody>
                            <p className="text-gray-600">Wizard coming next.</p>
                        </CardBody>
                    </Card>
                </div>
            </main>
        </AuthGuard>
    );
}


