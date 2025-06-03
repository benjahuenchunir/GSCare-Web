import Component from './service-booking'
import { useParams } from 'react-router-dom';

export default function Page() {
    const params = useParams();
    const id = params?.id;

    console.log("Page params:", params);
    return (
      <>
        <Component />
        <p>ID: {id}</p>
      </>
    );
}