import Card from '@/components/Card';
import HeaderLayout from '@/components/header/HeaderLayout';

export default function ClienteLayout({ children }: any) {
  return (
    <>
      <HeaderLayout showBtnTakeIt={false}></HeaderLayout>
      <Card title="Área do Cliente">{children}</Card>;
    </>
  );
}
