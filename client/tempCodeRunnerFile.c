#include <iostream>

using namespace std;

// Function to check if a given number is prime
bool isPrime(int n)
{
    if (n <= 1)
        return false;

    for (int i = 2; i * i <= n; i++)
    {
        if (n % i == 0)
            return false;
    }

    return true;
}

int *generatePrime(int n)
{
    int *array = new int[n];
    int num = 0;

    for (int i = 0; i <= n; i++)
    {
        if (isPrime(i))
        {
            array[num++] = i;
        }
    }

    // Resize the array to save memory
    int *result = new int[num];
    for (int i = 0; i < num; i++)
        result[i] = array[i];

    delete[] array;

    return result;
}

int main()
{
    int n;
    cout << "Enter the value of n: ";
    cin >> n;

    int *arr = generatePrime(n);

    cout << "Prime numbers less than or equal to " << n << ": ";
    for (int i = 0; i < n; i++)
    {
        cout << arr[i] << " ";
    }

    delete[] arr;

    return 0;
}
