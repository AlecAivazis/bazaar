// external imports
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
// local imports
import AppBar from '.'

test('highlights the fund link when on /funds', () => {
    // mount the app bar on /fund
    const wrapper = mount(
        <MemoryRouter initialEntries={['/funds']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/funds"]')
    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the fund link when on a fund subview', () => {
    // mount the app bar on /fund
    const wrapper = mount(
        <MemoryRouter initialEntries={['/funds/foo']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/funds"]')
    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the projects link when on /projects', () => {
    // mount the app bar on /projects
    const wrapper = mount(
        <MemoryRouter initialEntries={['/projects']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/projects"]')

    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the profile link when on /profile', () => {
    // mount the app bar on /profile
    const wrapper = mount(
        <MemoryRouter initialEntries={['/profile']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/profile"]')

    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the projects link when on a specific project', () => {
    // mount the app bar on a repo page
    const wrapper = mount(
        <MemoryRouter initialEntries={['/AlecAivazis/survey']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/projects"]')

    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})
