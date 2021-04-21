export default function Home(props) {
  return (
    <>
      <h1>Hello World</h1>
      <p>{JSON.stringify(props.epsodes)}</p>
    </>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      epsodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}
