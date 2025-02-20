export async function generateStaticParams() {
  return [{ slug: "123" }];
}

function TestPage(props: { params: { slug: string } }) {
  const { params } = props;

  const { slug } = params;
  return <div>TestPage {slug}</div>;
}

export default TestPage;
