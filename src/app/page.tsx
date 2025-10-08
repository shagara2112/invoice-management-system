import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to debug page to diagnose issues
  redirect('/debug');
}